import React from "react";
import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const GetStarted = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-5 max-w-xs lg:max-w-md xl:max-w-md mx-auto text-center font-mono animate-fade-up">
            <div className="bg-primary/10 rounded-full p-8 ring-8 ring-primary/5">
                <NotebookIcon className="size-10 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome to LangNote!</h1>
            <p className="text-base-content/70">
                Hi there! Welcome to LangNote. Get started by creating your LangNote
                account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                    to="/register"
                    id="get-started-register"
                    className="btn btn-primary text-primary-content font-semibold font-mono"
                >
                    Create Free Account
                </Link>
                <Link
                    to="/login"
                    id="get-started-login"
                    className="btn btn-outline btn-primary font-semibold font-mono"
                >
                    Log In
                </Link>
            </div>
        </div>
    );
};

export default GetStarted;
