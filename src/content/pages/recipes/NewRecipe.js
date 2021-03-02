// Packages
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
// import axios from 'axios';

export default function NewRecipe(props) {
  // Declare and initialize state variables
  let [message, setMessage] = useState("");
  let [redirect, setRedirect] = useState("");
  let [title, setTitle] = useState('');
  let [image, setImage] = useState('');
  let [alt, setAlt] = useState('');
  let [description, setDescription] = useState("");
  let [servings, setServings] = useState(0);
  let [chars, setChars] = useState(280);

  let [newIngredient, setNewIngredient] = useState('');
  let [ingredients, setIngredients] = useState([]);

  let [newDirection, setNewDirection] = useState('');
  let [directions, setDirections] = useState([]);

  let [newTag, setNewTag] = useState('')
  let [tags, setTags] = useState([]);

  useEffect(()=> {

    setMessage("");
  }, [title, alt, image, servings, directions, ingredients, tags])

  const handleSubmit = e => {
    e.preventDefault()
    // TODO: Send the user sign up data to the server
    fetch(`${process.env.REACT_APP_SERVER_URL}/recipes/`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        alt,
        userId: props.user._id,
        image,
        servings,
        description,
        directions: directions.join(),
        ingredients: ingredients.join(),
        tags: tags.join()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("mernToken")}`
      }
    }).then(response => {
        if (!response.ok) {
            console.log(response);
            setMessage(`${response.status}: ${response.statusText}`);
            return;
        } else {
            setRedirect(<Redirect to={`/`} />)
        }
    })
  }

  if (!props.user) {
    return <Redirect to="/auth/login" />
  }

  function makeList(items, setItems) {
    return (
      <>
        {items.map((item, i) => (
          <li>
          {item} 
          <button 
            onClick={() => {
              // deletes the item
              let tempItems = [...items]
              tempItems.splice(i, 1)
              setItems(tempItems)
            }}
          >
            X
          </button>
        </li>
        ))}
      </>
    )
  }

  function addItem(items, setItems, newItem, setNewItem) {
    if (newItem) {
      // first replace commas with fancy commas
      // setNewItem(newItem.replace(/,/g, ';'))
      setItems([...items, newItem]);
    }
    setNewItem('');
  }

  return (
    <div className="recipe-form-container">
      <h2 className="author thumbnail-tab">{props.user.name}'s New Recipe</h2>
      <div className="thumbnail-content">
        <form onSubmit={(e) => e.preventDefault()} className="recipe-form">
          <span className="red">{message}</span>
          <div>
            <label>Title:</label>
            <input type="text" name="title" 
              placeholder="something tasty"
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input type="url" name="image" onChange={e => setImage(e.target.value)} />
            {!image ? "":
              <div>
                <p>Image Preview:</p>
                <div 
                  style={{backgroundImage: 'url(' + image + ')'}}
                  alt={alt} 
                  className="recipe-img"
                >
                  <div className="recipe-img-text">
                    <h3>{description}</h3>
                  </div>
                </div>
              </div>
            }
          </div>
          <div>
            <label>Alt tag:</label>
            <input type="text" name="alt" 
              placeholder="add an alt tag for your image"
              onChange={e => setAlt(e.target.value)} 
            />
          </div>
          <div>
            <label>Description: ({chars} character{chars===1?'':'s'} remaining)</label>
            <input type="text" name="description" 
            placeholder="Describe your recipe" 
              onChange={(e) => {
                setDescription(e.target.value);
                setChars(280 - e.target.value.length);
              }} 
            />
          </div>
          <div>
            <label>Number of Servings:</label>
            <input type="number" name="servings" 
              placeholder="0"
              onChange={e => setServings(e.target.value)} 
            />
          </div>
          <div>
            <label>Ingredients:</label>
            <ul>
              {makeList(ingredients, setIngredients)}
            </ul>
            <input 
              type="text"
              placeholder="Comma-separate your list of ingredients..." 
              onChange={e => setNewIngredient(e.target.value)} 
            />
            <button
              onClick={() => addItem(ingredients, setIngredients, newIngredient, setNewIngredient)}
            >
              Add
            </button>
          </div>
          <div>
            <label>Directions:</label>
            <ol>
              {makeList(directions, setDirections)}
            </ol>
            <input 
              type="text" 
              placeholder="Preheat oven to 350 degrees." 
              onChange={e => setNewDirection(e.target.value)} 
            />
            <button
              onClick={() => addItem(directions, setDirections, newDirection, setNewDirection)}
            >
              Add
            </button>
          </div>
          <div>
            <label>Tags:</label>
            <p>Tags help users find your recipe. The more, the better!</p>
            <ul>
              {makeList(tags, setTags)}
            </ul>
            <input 
              type="text" 
              placeholder="dinner" 
              onChange={e => setNewTag(e.target.value)} 
            />
            <button
              onClick={() => addItem(tags, setTags, newTag, setNewTag)}
            >
              Add
            </button>
          </div>
          <button className="form-button" onClick={e => handleSubmit(e)}>Create Recipe!</button>
        </form>
        {redirect}
      </div>
    </div>

  )
}