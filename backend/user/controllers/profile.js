

export default async function getProfile(req, res) {
    try {
        const user = await UserInterface.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            userId: user._id,
            email: user.email,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};