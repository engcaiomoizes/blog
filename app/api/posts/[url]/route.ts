import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
    try {
        const { url } = await params;

        const client = await clientPromise;
        const db = client.db("blog");
        const posts = db.collection("posts");

        const response = await posts.findOne({
            url,
        });

        return NextResponse.json({ response }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error! ", err }, { status: 500 });
    }
}