


export async function POST(request) {
    try {
        const reqBody = await request.json()
        const { name, university_email, id, password, role } = reqBody
        console.log(reqBody)    

    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }  }

