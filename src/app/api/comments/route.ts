import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


/**
 * Assuming that env("DATABASE_URL") is set in .env file 
 * In the env file, I added a personal mongoDB connection string to test out the code.
 */
const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    try{
        /*  Here, since we mapped the commentId to MongoDB's '_id' field as an ObjectId,  we can sort 
        by commentId in an decreasing order to get most recent comments  */
        const recentComments = await prisma.comment.findMany({
            orderBy: {
                commentId: 'desc',
            },
            take: 50,
        });

        /* If successful, return the most recent comments*/
        return NextResponse.json({ test: "success", comments: recentComments}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
         });

    }catch (e){
        /* Error handler */
        return NextResponse.json({ test: "failure", error: (e as Error).message}, { status: 501 })
    }
}

export async function POST(req: NextRequest){ 
    try{
        /* Extract email, name, and comment text from the request and create a new 
        comment in the database. */
        const {email, name, comment} = await req.json();
        console.log(email, name, comment);
        const newComment = await prisma.comment.create({
            data :{
                email,
                name,
                comment,
            },
        });
    
        /* If successful, return the new comment along with the success message just for indication*/
        return NextResponse.json({ test: "success", comments: newComment}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }catch (e){
        /* Error handler */
        return NextResponse.json({ test: "failure", error: (e as Error).message}, { status: 502 })
    }
}