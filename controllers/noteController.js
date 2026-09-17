import Note from "../models/Note.js";

// CREATE NOTE
export const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user
        });

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            note
        });
    } catch (error) {
        next(error);
    }
};


// GET ALL NOTES
export const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({
            user: req.user
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            notes
        });
    } catch (error) {
        next(error);
    }
};


// GET SINGLE NOTE
export const getNote = async (req, res, next) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        res.status(200).json({
            success: true,
            note
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE NOTE
export const updateNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        if (title !== undefined) {
            note.title = title;
        }

        if (content !== undefined) {
            note.content = content;
        }

        await note.save();

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note
        });
    } catch (error) {
        next(error);
    }
};


// DELETE NOTE
export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        await note.deleteOne();

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};