/** 
 *  Developed By Rasya R. @chocopys
 *  Protected By MIT License
 *  My Instagram : https://instagram.com/r.rdtyptr
 *  My Github : https://github.com/Rasya25
*/

import axios from "axios";

export default function quote(text, ppurl, nickname) {
    return new Promise(async (resolve, reject) => {
        const json = {
            type: "quote",
            format: "png",
            backgroundColor: "#FFFFFF",
            width: 512,
            height: 768,
            scale: 2,
            messages: [
                {
                    entities: [],
                    avatar: true,
                    from: {
                        id: 1,
                        name: nickname,
                        photo: {
                            url: ppurl
                        }
                    },
                    text: text,
                    replyMessage: {}
                }
            ]
        };
        console.log(JSON.stringify(json, null, 2));
        try {
            const res = await axios.post("https://bot.lyo.su/quote/generate", JSON.stringify(json, null, 2), {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
}