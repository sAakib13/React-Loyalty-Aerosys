import React from 'react'
import clouds from "../../assets/clouds.png"

const Home = () => {
    return (
        <div>
            <div className="bg-primary h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url(${clouds})` }}>
                <div className="flex flex-col items-center justify-center h-[70vh] ">
                    <h1 className=" text-white lg:text-5xl p-2 sm:text-3xl">
                        Messaging when it matters
                    </h1>
                    <h4 className=" text-white lg:text-2xl p-2 sm:text-sm">
                        The essential mobile communications platform for high-impact organizations.
                    </h4>
                </div>
            </div>

        </div>
    )
}

export default Home
