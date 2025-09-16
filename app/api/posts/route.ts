import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("blog");
        const users = await db.collection("posts").find().toArray();

        return NextResponse.json(users);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao obter posts." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const client = await clientPromise;
        const db = client.db("blog");
        const users = db.collection("posts");

        const result = await users.insertOne({
            author: body.author,
            title: body.title,
            subtitle: body.subtitle,
            content: body.content,
            thumbnail: body.thumbnail,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Usuário cadastrado com sucesso!", id: result.insertedId });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao cadastrar post." }, { status: 500 });
    }
}