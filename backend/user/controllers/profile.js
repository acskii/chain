import UserInterface from "../interface.js";

export default async function getProfile(req, res) {
    try {
        let id = req.userId;

        // Find if profile requested is relating to other user
        // If not, get the profile of requesting token
        if (req.query.userId) {
            id = req.query.userId;
        }

        const user = await UserInterface.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            userId: user._id,
            email: user.email,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};