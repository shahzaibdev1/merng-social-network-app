import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Menu, Segment } from "semantic-ui-react";

function MenuBar() {
  let pathName = window.location.pathname;
  let path = pathName === "/" ? "home" : pathName.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <div>
      <Menu pointing secondary size='large' color='blue' inverted>
        <Container>
          <Menu.Item
            name='home'
            active={activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to='/'
          />
          <Menu.Item
            name='Login'
            active={activeItem === "Login"}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='Register'
            active={activeItem === "Register"}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='logout'
              active={activeItem === "logout"}
              onClick={handleItemClick}
              as={Link}
              to='/logout'
            />
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  );
}

export default MenuBar;
