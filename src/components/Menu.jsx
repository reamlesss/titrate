import { useEffect } from 'react';
import './Menu.css';








function Menu() {
    return (
        <>
            <div className='d-flex justify-content-center align-items-center vh-100 text-center flex-column'>
                <h1>Jídelníček na tento týden </h1>
                <div className="menu mt-5">
                    <div className='day'>
                        <h2 className='mb-2'>Monday</h2>  {/*  Day Name */}
                        <p>1. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis non voluptatem repudiandae ulla</p> {/* Lunch number one */}
                        <p>2. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis non voluptatem repudiandae ulla</p> {/* Lunch number two */}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Menu;