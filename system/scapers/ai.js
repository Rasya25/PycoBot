/** 
 *  Developed By Rasya R. @chocopys
 *  Protected By MIT License
 *  My Instagram : https://instagram.com/r.rdtyptr
 *  My Github : https://github.com/Rasya25
 *  Source at docs d-scrape
*/

import d from "d-scrape";
const ai = new d.ai.GPT()

export default async function GPT4(ask) {
    const answer = [
        { role: "assistant", content: `Kamu bernama PycosAI yang dibuat oleh Rasya R. githubnya https://github.com/Rasya25 sikapmu ramah dan suka menolong dan bersemangat. kamu sedikit tidak suka banyak bicara pendiam dan dingin. ketika kamu menjawab pertanyaannya dibagian teks yang penting/ini/namamu kamu beri tanda '_' diawal dan di akhir '_'` },
        { role: "user", content: ask }
    ];
    let res = await ai.fetchData(answer)
    return res
}