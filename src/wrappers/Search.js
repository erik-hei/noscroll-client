import React, { useState } from 'react';
import axios from "axios";
import { Redirect, Link } from "react-router-dom";

export default function Search(props) {
    const [error, setError] = useState(null);
    const [formInput, setFormInput] = useState("");
    
    const handleSubmit = e => {
        // e.preventDefault();
        axios.get(`${process.env.REACT_APP_SERVER_URL}/recipes?tags=${formInput}`)
        .then(response => {
            if (response.data.message) {
                console.log(response.data.err);
                setError(response.data.message);
            } else {
                console.log(formInput)
                props.setSearchedRecipes(response.data);
                // return <Redirect to="/recipes" />
            }
        }).catch(err => {
            console.log(err);
          })
    }
    
    return (
        <div className="App-search">
            {/* <form onSubmit={e => handleSubmit(e)}> */}
            <form>
                <label className="search-label">Type in keywords to discover new recipes!</label>
                <button className="search-button" type="submit">
                    <Link onClick={e => handleSubmit(e)} to="/recipes" alt="Search">🔍</Link>
                    {/* 🔍 */}
                </button>
                <input type="text" className="search-field" placeholder="Type in keywords to discover new recipes!" name="search" onChange={e => setFormInput(e.target.value)} required />
            </form>
        </div>
    )
}

//put into recipes so instead of header, call search at top of recipes
//orrrr put it in content
