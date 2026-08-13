import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const auth = getAuth(req);
        const userId = auth?.userId;

        console.log("AUTH:", auth);
        console.log("USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const user = await clerkClient.users.getUser(userId);

        console.log("USER EMAIL:", user.emailAddresses[0]?.emailAddress);
        console.log("USER METADATA:", user.privateMetadata);

        if (user.privateMetadata?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this route"
            });
        }

        next();

    } catch (error) {
        console.log("ADMIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};