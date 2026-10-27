import React from "react";
import { NotebookIcon, X } from "lucide-react";
import { Link } from "react-router";

const GetStarted = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-5 max-w-xs lg:max-w-md xl:max-w-md mx-auto text-center font-mono">
            <div className="bg-primary/10 rounded-full p-8">
                {/* <img src="/assets/langnote.png" alt="logo" className="size-10" /> */}
                <NotebookIcon className="size-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Welcome to LangNote!</h3>
            <p className="text-base-content/70">
                Hi there! Welcome to LangNote. Get started by creating your LangNote
                account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                    to="/register"
                    className="btn btn-primary text-amber-100 font-medium font-mono"
                >
                    Create Free Account
                </Link>
                <Link
                    to="/login"
                    className="btn btn-outline btn-primary font-medium font-mono"
                >
                    Log In
                </Link>
            </div>
        </div>
    );
};

export default GetStarted;
