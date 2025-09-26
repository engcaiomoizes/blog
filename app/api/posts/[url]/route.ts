import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
    try {
        const { url } = await params;

        const client = await clientPromise;
        const db = client.db("blog");
        const posts = db.collection("posts");

        const response = await posts.aggregate([
            {
                $match: { url },
            },
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
                    thumbnail: 1,
                    createdAt: 1,
                    author: {
                        name: 1,
                    },
                },
            },
        ]).toArray();

        // const post = await posts.findOne({
        //     url,
        // });

        if (response.length === 0)
            return NextResponse.json({ message: "Postagem não encontrada." }, { status: 404 });

        return NextResponse.json({ response: response[0] }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error! ", err }, { status: 500 });
    }
}