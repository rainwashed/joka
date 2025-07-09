const fs = require("fs");
const process = require("process");
const ollama = require("ollama").default;

async function filterContent(arg0) {
  try {
    const prompt = fs
      .readFileSync("prompt.md", "utf8")
      .replace("CONTENT*PLACEHOLDER*:p", arg0);

    // Create the .dev file to enable debugging logs
    if (fs.existsSync(".dev")) {
      console.log(prompt);
      console.log("----------------------------");
    }

    const response = await ollama.chat({
      model: "llama3.2:3b",
      messages: [{ role: "user", content: prompt }],
      format: {
        type: "object",
        properties: {
          block: {
            type: "boolean",
          },
        },
        required: ["block"],
      },
    });

    console.log(response.message.content);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  if (process.argv.length < 3) {
    console.log("Missing content.");
    process.exit(2);
  } else if (process.argv.length > 3) {
    console.log("Too many args.");
    process.exit(2);
  } else {
    filterContent(process.argv[2]);
  }
}

module.exports = { filterContent };
