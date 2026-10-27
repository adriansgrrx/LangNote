import React from "react";
import { Link } from "react-router";
import { NotebookIcon } from "lucide-react";
import { formatToUppercase } from "../lib/utils";

const NotesNotFound = ({ username }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-xs lg:max-w-md xl:max-w-md mx-auto text-center font-mono animate-fade-up">
            <div className="bg-primary/10 rounded-full p-8 ring-8 ring-primary/5">
                <NotebookIcon className="size-10 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold">No notes yet</h1>
            <p className="text-base-content/70">
                Hi, {formatToUppercase(username)}! You don't have any notes yet. Create
                your first note to get started.
            </p>
            <Link
                to="/create"
                id="empty-create-note"
                className="btn btn-sm md:btn-md btn-primary text-sm md:text-base text-primary-content font-semibold font-mono gap-2 tracking-wide"
            >
                Create Your First Note
            </Link>
        </div>
    );
};

export default NotesNotFound;
