import bcrypt from "bcrypt";
import userInterface from "../interface.js";
import generateToken from "../util/token.js";

export async function register(req, res) {
    const { email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await userInterface.create({ email, password: hashedPass });
    // Verification here

    res.status(201).json({ message: "User created. Please verify your email." });
};

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await userInterface.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ token });
};