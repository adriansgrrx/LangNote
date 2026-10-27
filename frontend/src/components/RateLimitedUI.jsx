import React from 'react'
import { ZapIcon } from 'lucide-react'

const RateLimitedUI = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-8 font-mono animate-fade-up" role="alert">
            <div className="bg-warning/10 border border-warning/40 rounded-box shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                <div className="flex items-center justify-center bg-warning/20 p-4 rounded-full">
                    <ZapIcon className="size-10 text-warning" aria-hidden="true" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-semibold mb-2">
                    Too Many Requests
                    </h2>
                    <p className="text-base-content mb-1">
                    The system has detected a high number of requests in a short time.
                    </p>
                    <p className="text-sm text-base-content/70">
                    Please pause briefly and try again to continue smoothly.
                    </p>
                </div>
                </div>
            </div>
        </div>
    )
}

export default RateLimitedUI