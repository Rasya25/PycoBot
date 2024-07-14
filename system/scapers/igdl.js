/** 
 *  Developed By Rasya R. @chocopys
 *  Protected By MIT License
 *  My Instagram : https://instagram.com/r.rdtyptr
 *  My Github : https://github.com/Rasya25
*/

import axios from "axios";

export default async function igdl(url) {
    try {
        const response = await axios.request({
            method: "GET",
            url: "https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/",
            params: { url: url },
            headers: {
                "X-RapidAPI-Key": "6a9259358bmshba34d148ba324e8p12ca27jsne16ce200ce10",
                "X-RapidAPI-Host": "instagram-post-reels-stories-downloader.p.rapidapi.com"
            }
        });
        const urls = response.data.result.map(item => item.url);
        return urls;
    } catch (error) {
        return {};
    }
}