import mongoose from "mongoose";
import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;

        let query = Note.find({ user: req.user._id }).sort({ createdAt: -1 });

        if (limit > 0) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const notes = await query;
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getNote(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID format." });
        }

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note NOT FOUND." });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNote", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Title is required." });
        }

        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ message: "Content is required." });
        }

        const savedNote = new Note({
            title: title.trim(),
            content: content.trim(),
            user: req.user._id,
        });

        await savedNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateNote(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID format." });
        }

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note NOT FOUND." });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (req.body.title !== undefined) {
            if (typeof req.body.title !== "string" || !req.body.title.trim()) {
                return res.status(400).json({ message: "Title cannot be empty." });
            }
            note.title = req.body.title.trim();
        }

        if (req.body.content !== undefined) {
            if (typeof req.body.content !== "string" || !req.body.content.trim()) {
                return res.status(400).json({ message: "Content cannot be empty." });
            }
            note.content = req.body.content.trim();
        }

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteNote(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID format." });
        }

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note NOT FOUND." });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note DELETED successfully." });
    } catch (error) {
        console.error("Error in deleteNote", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
