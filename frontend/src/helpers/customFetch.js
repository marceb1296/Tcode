const customFetch = () => {   

    const post = async (url, data, download=false) => {
        
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => key === "data" ? formData.append(key, JSON.stringify(value)) : formData.append(key, value))

        const normalPost = {
            method: "POST",
            body: formData
        };
        
        const res = await fetch(url, normalPost).then(
            res => {
                if (!res.ok) {
                    throw new Error()
                }
                return download ? res.blob() : res.json()
            } 
        )

        return res;
    }

    return {
        post
    }
}
 
export default customFetch;