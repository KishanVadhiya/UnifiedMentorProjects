
const axios= require('axios');
require('dotenv').config();

const emailSubjectTemplate = (companyName) => `
Subject: Thank You for Your Response – ${companyName}
`;
const emailTemplate = (candidateName, companyName) => `
Dear ${candidateName},

Thank you for your response to ${companyName}.

We appreciate your time and interest in our opportunity. Your response has been successfully recorded, and our team will review it. If there are any further steps, we will reach out to you.

Feel free to contact us if you have any questions.

Best regards,  
HR Team  
${companyName}
`;


const sendEmail = async (receieverEmail,receiverName,companyName) =>{
    const postData = {
        receiver:receieverEmail,
        sub: emailSubjectTemplate(companyName),
        msg: emailTemplate(receiverName,companyName),
    }

    await axios.post(process.env.MAILING,postData,{
        headers: {
            "Content-Type": "application/json",
        }
    });
}

// sendEmail("kumarkishanvadhia@gmail.com","Kishan Kumar Vadhia","Meesho").then((data)=>console.log(data)).catch(err=>console.log(err));


module.exports=sendEmail;