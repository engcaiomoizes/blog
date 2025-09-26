import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("blog");
        // const response = await db.collection("posts").find().toArray();
        const posts = db.collection("posts");

        const response = await posts.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { authorId: { $toObjectId: "$author" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$authorId"],
                                },
                            },
                        },
                    ],
                    as: "author",
                },
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    title: 1,
                    subtitle: 1,
                    content: 1,
                    url: 1,
                    createdAt: 1,
                    author: {
                        name: 1,
                    },
                },
            },
        ]).toArray();

        return NextResponse.json({ response }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao obter posts.", err }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type');
        if (!contentType || !contentType.includes('multipart/form-data')) {
            console.error("Tipo de conteúdo inválido!");
            return NextResponse.json({ message: "Tipo de conteúdo inválido." }, { status: 400 });
        }

        const formData = await req.formData();

        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const subtitle = formData.get('subtitle') as string;
        const content = formData.get('content') as string;
        const file = formData.get('file') as File;

        if (!file) {
            console.error("Thumbnail ausente.");
            return NextResponse.json({ message: "Thumbnail ausente." }, { status: 400 });
        }

        let thumbnail = null;
        
        if (file && typeof file != 'string') {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);

            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(bytes);
                    controller.close();
                }
            });

            const fileForCloudinary = new File([await (new Response(stream)).blob()], file.name, { type: file.type });

            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', fileForCloudinary);
            cloudinaryFormData.append('folder', `${process.env.NEXT_PRIVATE_CLOUDINARY_FOLDER}`);
            cloudinaryFormData.append('upload_preset', `${process.env.NEXT_PRIVATE_CLOUDINARY_PRESET}`);

            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.NEXT_PRIVATE_CLOUDINARY_API_KEY + ":" + process.env.NEXT_PRIVATE_CLOUDINARY_API_SECRET).toString('base64')}`
                },
                body: cloudinaryFormData,
            });

            const cloudinaryData = await cloudinaryResponse.json();

            if (!cloudinaryResponse.ok) {
                console.error("Cloudinary error: ", cloudinaryData);
                return NextResponse.json({ error: "Erro ao fazer upload para o Cloudinary: " + cloudinaryData.error }, { status: 500 });
            }

            thumbnail = cloudinaryData.public_id;
        }

        const session = await getServerSession(authOptions);

        const client = await clientPromise;
        const db = client.db("blog");
        const posts = db.collection("posts");

        const result = await posts.insertOne({
            author: session?.user.id,
            title: title,
            url: url,
            subtitle: subtitle,
            content: content,
            thumbnail: thumbnail,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Publicado com sucesso!", result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao cadastrar post." }, { status: 500 });
    }
}

export async function DELETE(req: NextResponse) {
    try {
        const { id } = await req.json();

        const client = await clientPromise;
        const db = client.db("blog");
        const posts = db.collection("posts");

        const objectId = new ObjectId(String(id));

        const post = await posts.findOne({ _id: objectId });

        if (!post)
            return NextResponse.json({ message: "Postagem não encontrada." }, { status: 404 });

        const { thumbnail } = post;

        if (thumbnail) {
            try {
                await deleteImageFromCloudinary(thumbnail);
                console.log(`Imagem com public_id ${thumbnail} excluída do Cloudinary.`);
            } catch (err) {
                console.error("Erro ao excluir imagem do Cloudinary: ", err);
                return NextResponse.json({ message: "Erro ao exluir a imagem do Cloudinary.", err }, { status: 500 });
            }
        }

        const result = await posts.deleteOne({
            _id: objectId,
        });

        if (result.deletedCount === 1)
            return NextResponse.json({ message: "Postagem deletada com sucesso!" });
        else
            return NextResponse.json({ message: "Erro ao deletar a postagem." }, { status: 500 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error! ", err }, { status: 500 });
    }
}

import crypto from "crypto";

const deleteImageFromCloudinary = async (publicId: string) => {
    try {
        const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`;

        const apiSecret = process.env.NEXT_PRIVATE_CLOUDINARY_API_SECRET;
        const timestamp = Math.floor(Date.now() / 1000);

        const signature = crypto.createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`).digest('hex');

        const deleteFormData = new FormData();
        deleteFormData.append('public_id', publicId);
        deleteFormData.append('api_key', `${process.env.NEXT_PRIVATE_CLOUDINARY_API_KEY}`);
        deleteFormData.append('timestamp', String(timestamp));
        deleteFormData.append('signature', signature);

        const cloudinaryDeleteResponse = await fetch(cloudinaryDeleteUrl, {
            method: 'POST',
            body: deleteFormData,
        });

        const cloudinaryDeleteData = await cloudinaryDeleteResponse.json();

        if (!cloudinaryDeleteResponse.ok) {
            console.error("Erro ao excluir imagem no Cloudinary: ", cloudinaryDeleteData);
            throw new Error(`Erro ao excluir imagem: ${cloudinaryDeleteData.error.message}`);
        }

        console.log("Imagem excluída com sucesso: ", cloudinaryDeleteData);
        return cloudinaryDeleteData;
    } catch (err) {
        console.error("Erro ao tentar excluir a imagem: ", err);
        throw new Error(`Erro: ${err}`);
    }
};