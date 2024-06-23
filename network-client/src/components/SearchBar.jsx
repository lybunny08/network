import React from "react";
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ result }) => {

    return (
        <div class="input-group" id='search-input'>
            <span className="input-group-text" id="basic-addon1">
            <FaSearch />
            </span>
            <input type="text" 
                className="form-control" 
                placeholder="Recherche" 
                aria-label="Username" 
                aria-describedby="basic-addon1"/>
        </div>
    );
}

export default SearchBar