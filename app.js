import express from "express";

import { router as index } from "./api/index.js";
import { router as admin_api } from "./api/admin_api.js";
import { router as user_api } from "./api/user_api.js";
import { router as instructor } from "./api/instructor_api.js"
import { router as adminOrganization } from "./api/admin_organization_api.js"
import { router as course } from "./api/course_api.js"
import { router as document } from "./api/document_api.js"
import { router as enrollment } from "./api/enrollment_api.js"
import cors from "cors";
import { router as file_api } from "./api/file_api.js"


export const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World! this is app.js');
// });
app.use(
    cors({
        origin: "*",
    })
);

// app.use(bodyParser.text());
// app.use(bodyParser.json());

app.use(express.json());
app.use("/", index);
app.use("/admin", admin_api);
app.use("/adminOrganization", adminOrganization);
app.use("/instructor", instructor);
app.use("/user", user_api);
app.use("/course", course);
app.use("/document", document);
app.use("/enrollment", enrollment);
app.use("/file", file_api);

// app.listen(3000);