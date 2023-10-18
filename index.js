const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json({ limit: '50mb' })); // Add this line to parse JSON requests

const Replicate = require("replicate");
const replicate = new Replicate({
    auth: 'r8_9lVdjy8zKbsIpBtvhUzI7yU3rMZfB3E29bDy8',
});
let isWebhookReceived = false;

const promptsAndImages = [
    {
        prompt: "mid shot portrait photo of TOK with a wavy mullet fade hairstyle, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/mullet1_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a wavy mullet fade hairstyle, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/mullet1_right.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a wavy mullet fade hairstyle, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/mullet2_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a wavy mullet fade hairstyle, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/mullet2_right.jpg"
    },

    {
        prompt: "mid shot portrait photo of TOK with undercut fade hairstyle, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/undercut_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with undercut fade hairstyle, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/undercut_right.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/short_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/short_right.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with pompadour hairstyle, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/pomp_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with pompadour hairstyle, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/pomp_right.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with long hair, cool cinematic LUT, eyes looking straight ahead",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/long.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with long hair, cool cinematic LUT, eyes looking straight ahead",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/long_2.png"
    },
    {
        prompt: "mid shot portrait photo of TOK with long hair, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/midlength1_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with long hair, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/midlength1_right.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a pompadour hairstyle, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/pomp2_right.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a pompadour hairstyle, cool cinematic LUT",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/pomp2_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a mohawk hairstyle hair, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/mohawk_left.jpg"
    },
    {
        prompt: "mid shot portrait photo of TOK with a mohawk hairstyle, cool cinematic LUT, wearing sunglasses",
        image: "https://storage.googleapis.com/avataryaidemo_bucket/mohawk_right.png"
    }
];

app.post('/webhook_training', (req, res) => {
    let payload = req.body;

    // Extract the version from the output
    let outputVersion = payload.output.version;

    // Log the extracted version
    console.log('Extracted version:', outputVersion);
    isWebhookReceived = true;  // Set the flag to true when the webhook is received
    runMainAfterWebhook(outputVersion);

    res.status(200).send('Webhook received successfully');
});

function runMainAfterWebhook(outputVersion) {
    if (isWebhookReceived) {
        main(outputVersion);
    } else {
        console.log('Webhook has not been received yet.');
    }
}


// app.post('/webhook_predictions', (req, res) => {
//     const payload = req.body;

//     // Check if payload contains 'output' property and it's an array
//     if (payload && Array.isArray(payload.output) && payload.output.length > 0) {
//         // Extract the link from the output array
//         const outputLink = payload.output[0];
//         outputLinks.push(outputLink);
//         console.log(outputLinks)
//     } else {
//         console.error('Invalid payload format or missing output link.');
//     }

//     res.status(200).send('Webhook received successfully');
// });
// app.post('/webhook_predictions', (req, res) => {
//     const payload = req.body;

//     // Check if payload contains 'output' property and it's an array
//     if (payload && Array.isArray(payload.output) && payload.output.length > 0) {
//         // Extract the link from the output array
//         const outputLink = payload.output[0];
//         outputLinks.push(outputLink);
//     } else {
//         console.error('Invalid payload format or missing output link.');
//     }

//     res.status(200).send('Webhook received successfully');
//     if (outputLinks.length === 16) {
//         console.log("Output Links:", outputLinks);
//     }
// });


async function main(outputVersion) {
    for (const item of promptsAndImages) {
        // const item = promptsAndImages[i];
        try {
            const prediction = await replicate.run(
                outputVersion,
                {
                    input: {
                        prompt: item.prompt,
                        image: item.image,
                        negative_prompt: "painting, drawing, illustration, distorted eyes, glitch, deformed, mutated, cross-eyed, ugly, disfigured, soft, smooth, distorted, drawing, painting, crayon, sketch, graphite, impressionist, noisy, blurry, soft, deformed, ugly, cartoon, anime, smooth, bad eyes, cross eyed",
                        prompt_strength: 0.65,
                        apply_watermark: false
                    },
                    webhook: "https://aihair-prediction.onrender.com/webhook_predictions",
                    webhook_events_filter: ["completed"]
                });
            // console.log("Prediction result:", prediction);
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

}
// main()


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
