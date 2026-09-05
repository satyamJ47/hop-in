const { CloudTasksClient } = require("@google-cloud/tasks");

const client = new CloudTasksClient();

const PROJECT_ID = "hop-in-ridebookingwebapp";
const LOCATION = "asia-southeast1";
const QUEUE = "refund-queue";

const CLOUD_RUN_URL =
    "https://hop-in-api-228930823058.asia-southeast1.run.app";

async function createTask({ path, payload }) {
    const parent = client.queuePath(
        PROJECT_ID,
        LOCATION,
        QUEUE
    );

    const task = {
        httpRequest: {
            httpMethod: "POST",
            url: `${CLOUD_RUN_URL}${path}`,
            headers: {
                "Content-Type": "application/json",
                "X-Internal-Job-Secret": process.env.INTERNAL_JOB_SECRET
            },
            body: Buffer.from(
                JSON.stringify(payload)
            ).toString("base64")
        }
    };

    const [response] = await client.createTask({
        parent,
        task
    });

    console.log("Cloud Task created:", response.name);

    return response;
}

module.exports = {
    createTask
};