const axios = require('axios');
const readline = require('readline');
const { google } = require('googleapis');
const fs = require('fs');
const nodemailer = require('nodemailer'); 

console.log('==================================================');
console.log('🧪 Neo Ontorjal Bot: ডাটা ফিল্টার ও জিমেইল সেন্ডার মোড...');
console.log('==================================================\n');

// ================= CONFIGURATIONS =================
const OPENROUTER_API_KEY = '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';
const AI_MODEL = 'tencent/hy3:free';
const SPREADSHEET_ID = '1CMl1970cAibZgcVlr_Em4BykdwrdDkg-fN9E6pW3Kp4'; 

// 🛑 আপনার জিমেইল কনফিগারেশন (এখানে আপনার সঠিক তথ্য দিন)
const SENDER_EMAIL = 'shzemi632@@gmail.com';       
const GMAIL_APP_PASSWORD = 'usko zpxl arhf yyxm'; 

const session = {
    history: [],
    humanMode: false,
    customerData: {
        name: 'Guest User',
        contact: 'Not Provided',
        brand: 'Not Mentioned',
        service: 'E-commerce Website',
        timeline: '2-3 Weeks', 
        budget: 'Not Mentioned'
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ================= EMAIL AUTOMATION FUNCTION =================
async function sendAgreementEmail(customerData) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: SENDER_EMAIL, pass: GMAIL_APP_PASSWORD }
    });

    const emailBody = `
Dear ${customerData.name},

Hope you are doing well. Thank you for choosing Neo Ontorjal Agency for your upcoming project, "${customerData.brand}". 

Based on our live chat discussion, we have generated your official Project Agreement Proposal details below:

==================================================
📄 PROJECT AGREEMENT PROPOSAL
==================================================
👤 Client Name: ${customerData.name}
📧 Client Email: ${customerData.contact}
💼 Business Name: ${customerData.brand}
🛠️ Platform/Type: ${customerData.service}
⏳ Project Timeline: ${customerData.timeline}
💰 Total Budget: ${customerData.budget}
💳 Payment Terms: 50% Advance to initiate, 50% upon final delivery.
==================================================

👉 If you approve this proposal and want to start the project, please reply to this email by typing:
"Approved"

Once we receive your "Approved" reply, our development team will officially initiate the phase.

Best Regards,
Neo Ontorjal Agency
    `;

    let mailOptions = {
        from: `"Neo Ontorjal Agency" <${SENDER_EMAIL}>`,
        to: customerData.contact, 
        subject: `Project Agreement Proposal for ${customerData.brand} - Neo Ontorjal`,
        text: emailBody
    };

    try {
        if(SENDER_EMAIL === 'YOUR_GMAIL@gmail.com') return;
        await transporter.sendMail(mailOptions);
        console.log(`✉️ [Email Success]: এগ্রিমেন্টটি সফলভাবে ${customerData.contact} ঠিকানায় পাঠানো হয়েছে!`);
    } catch (error) {
        console.error('❌ Email Sending Error:', error.message);
    }
}

// ================= GOOGLE SHEETS FUNCTION =================
async function saveOrderToGoogleSheets(name, contact, brand, service, timeline, budget, additionalInfo) {
    try {
        if (!fs.existsSync('credentials.json')) {
            console.log('\n⚠️ [Google Sheets Error]: credentials.json ফাইলটি পাওয়া যায়নি!');
            return;
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        const sheets = google.sheets({ version: 'v4', auth });
        const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:H', 
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[currentDate, name, contact, brand, service, timeline, budget, additionalInfo]]
            }
        });
        console.log('\n📊 [Google Sheets Success]: অর্ডারের আসল হিস্ট্রি গুগল শিটে সফলভাবে সেভ হয়েছে! ✅\n');
    } catch (error) {
        console.error('\n❌ Google Sheets API Error:', error.message);
    }
}

// ================= OPENROUTER AI INTEGRATION =================
async function getAIResponse(chatHistory, userMessage) {
    try {
        const messages = [
            { role: "system", content: "You are an expert AI Sales Agent for 'Neo Ontorjal Agency'. Respond friendly in Bangla/English." },
            ...chatHistory,
            { role: "user", content: userMessage }
        ];
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', { model: AI_MODEL, messages: messages }, {
            headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        return "🤖 (AI Error): দুঃখিত, ওপেন-রাউটার এআই কানেকশনে কিছুটা সমস্যা হচ্ছে।";
    }
}

// ================= DATA COMPLETENESS CHECK =================
function checkMissingDataAndPrompt(callback) {
    const missingFields = [];
    if (session.customerData.name === 'Guest User') missingFields.push('Name (নাম)');
    if (session.customerData.contact === 'Not Provided') missingFields.push('Gemil (ইমেইল)');
    if (session.customerData.brand === 'Not Mentioned') missingFields.push('Website Name (বিজনেসের নাম)');
    if (session.customerData.budget === 'Not Mentioned') missingFields.push('Budget (বাজেট)');

    if (missingFields.length > 0) {
        console.log(`\n⚠️ [Data Missing Alert]: চ্যাট থেকে ${missingFields.join(', ')} পাওয়া যায়নি!`);
        rl.question('👉 আপনি কি ম্যানুয়ালি বাকি ডাটা ইনপুট দিতে চান? (yes/no): ', (ans) => {
            if (ans.trim().toLowerCase() === 'yes') {
                askForManualInput(0, missingFields, callback);
            } else {
                console.log("ℹ️ [System]: আগের ডাটা নিয়েই শিটে পাঠানো হচ্ছে...");
                callback();
            }
        });
    } else {
        callback();
    }
}

function askForManualInput(index, fields, callback) {
    if (index >= fields.length) {
        callback();
        return;
    }
    rl.question(`📝 Enter ${fields[index]}: `, (inputVal) => {
        if (fields[index].includes('Name')) session.customerData.name = inputVal;
        if (fields[index].includes('Gemil')) session.customerData.contact = inputVal;
        if (fields[index].includes('Website Name')) session.customerData.brand = inputVal;
        if (fields[index].includes('Budget')) session.customerData.budget = inputVal;
        
        askForManualInput(index + 1, fields, callback);
    });
}

// ================= BOT LOGIC FOR TERMINAL =================
async function handleMessage(messageBody) {
    const lowerMsg = messageBody.trim().toLowerCase();

    // 🔍 [LOCAL STORAGE SMART FILTER]
    if (lowerMsg.includes('client name:') || lowerMsg.includes('name:')) {
        const match = messageBody.match(/(?:client name:|name:)\s*([^\n,]+)/i);
        if (match) session.customerData.name = match[1].trim();
    } else if (lowerMsg.includes('ami ') || lowerMsg.includes('name is')) {
        const words = messageBody.split(' ');
        session.customerData.name = words.slice(-2).join(' ');
    }

    if (lowerMsg.includes('@') && lowerMsg.includes('.com')) {
        const emailMatch = messageBody.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) session.customerData.contact = emailMatch[0].trim();
    }

    if (lowerMsg.includes('business:') || lowerMsg.includes('website name:') || lowerMsg.includes('brand:')) {
        const match = messageBody.match(/(?:business:|website name:|brand:)\s*([^\n,]+)/i);
        if (match) session.customerData.brand = match[1].trim();
    }

    if (lowerMsg.includes('platform:') || lowerMsg.includes('type:')) {
        const match = messageBody.match(/(?:platform:|type:)\s*([^\n,]+)/i);
        if (match) session.customerData.service = match[1].trim();
    } else if (lowerMsg.includes('food')) {
        session.customerData.service = "Custom Coded Food E-commerce";
    }

    if (lowerMsg.includes('budget:')) {
        const match = messageBody.match(/budget:\s*([^\n,]+)/i);
        if (match) session.customerData.budget = match[1].trim();
    } else if (lowerMsg.includes('budget') || lowerMsg.includes('টাকা') || lowerMsg.includes('bdt') || lowerMsg.includes('৳')) {
        const numMatch = messageBody.match(/\d+[\d,.\s]*(?:bdt|taka|টাকা|৳)?/i);
        if (numMatch) session.customerData.budget = numMatch[0].trim();
    }
    
    if (lowerMsg.includes('timeline:') || lowerMsg.includes('time line:')) {
        const match = messageBody.match(/(?:timeline:|time line:)\s*([^\n,]+)/i);
        if (match) session.customerData.timeline = match[1].trim();
    } else {
        const timeMatch = messageBody.match(/\d+-\d+\s*(?:weeks|week|days|day|সপ্তাহ|মাস)|\d+\s*(?:weeks|week|days|day|সপ্তাহ|মাস)/i);
        if (timeMatch) session.customerData.timeline = timeMatch[0].trim();
    }

    // 💾 অর্ডার সেভ করার কমান্ড
    if (
        lowerMsg.includes('save') || 
        lowerMsg.includes('confirm') || 
        lowerMsg.includes('সেভ') || 
        lowerMsg.includes('অর্ডার')
    ) {
        checkMissingDataAndPrompt(async () => {
            console.log("\n⚡ [System]: লাইভ চ্যাট থেকে প্রাপ্ত ডাটা প্রসেস হচ্ছে... ⏳");
            
            await saveOrderToGoogleSheets(
                session.customerData.name, 
                session.customerData.contact, 
                session.customerData.brand,
                session.customerData.service, 
                session.customerData.timeline, 
                session.customerData.budget, 
                "Pending (Email Sent)" 
            );

            console.log("⚡ [System]: কাস্টমারের ইমেইলে অফিশিয়াল এগ্রিমেন্ট পাঠানো হচ্ছে... ⏳");
            await sendAgreementEmail(session.customerData);
            
            console.log(`\n🤖 Agent: সফলভাবে ডাটা শিটে সেভ হয়েছে ও মেইল পাঠানো হয়েছে! ✅`);
            askUser();
        });
        return;
    }

    if (lowerMsg === 'hi' || lowerMsg === 'hello' || lowerMsg === 'হ্যালো') {
        console.log(`\n🤖 Agent: *Neo Ontorjal Agency*-তে আপনাকে স্বাগত! 😊 কী সার্ভিস লাগবে বলুন?\n`);
        askUser();
        return;
    }

    console.log("\n🤖 Agent: (AI চিন্তা করছে...) 🤔");
    session.history.push({ role: "user", content: messageBody });
    if (session.history.length > 10) session.history.shift();

    const aiReply = await getAIResponse(session.history, messageBody);
    session.history.push({ role: "assistant", content: aiReply });
    
    console.log(`\n🤖 Agent: ${aiReply}\n`);
    askUser();
}

function askUser() {
    rl.question('You: ', async (userInput) => {
        if (userInput.trim().toLowerCase() === 'exit') {
            rl.close();
            process.exit(0);
        }
        await handleMessage(userInput);
    });
}

console.log("👉 চ্যাট শুরু করতে 'Hi' লিখুন।");
console.log("👉 গুগল শিটে ডাটা পাঠাতে সরাসরি 'order save koro' লিখুন।\n");
askUser();