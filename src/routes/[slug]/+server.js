export async function GET({ params }) {
    const slug = params.slug;

    try {
        const response = await fetch(
            `https://cs361a.wl.r.appspot.com/entry/${slug}`,
        );
        const data = await response.json();

        if (data.url) {
            postClick(slug);
            return new Response(undefined, {
                status: 302,
                headers: {
                    'Location': data.url
                }
            })
        } else {
            return new Response(undefined, {
                status: 302,
                headers: {
                    'Location': '/error'
                }
            });
        }
    } catch (error) {
        return new Response(undefined, {
            status: 302,
            headers: {
                'Location': '/error'
            }
        });
    }

}

let postClick = async (slug) => {
    const url = "https://cs361a.wl.r.appspot.com/analyze";
    const data = JSON.stringify({ param: slug });

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
        keepalive: true
    });
};