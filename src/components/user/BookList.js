import React from "react";
import {
  Grid,
  Header,
  Form,
  Icon,
  Image,
  Input,
  Item,
  Segment,
  Button,
} from "semantic-ui-react";

import { useDispatch } from "react-redux";
import { quantityCart } from "../reducers/action";
function BookList({
  quantityCartt,
  isBooksLoading,
  bookTextSearch,
  books,
  handleInputChange,
  handleSearchBook,
  handleAddToCard,
  cart,
}) {
  let bookList;
  const dispatch = useDispatch();

  const dispatchh = () => {
    dispatch(
      quantityCart({
        quantityCartt: quantityCartt,
      })
    );
  };

  if (books.length === 0) {
    bookList = <Item key="no-book">No book</Item>;
  } else {
    bookList = books.map((book) => {
      const handleaddToCartProcess = () => {
        handleAddToCard(book);
        dispatchh();
      };

      return (
        <Item key={book.isbn}>
          <Image
            src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
            size="tiny"
            bordered
            rounded
          />
          <Item.Content>
            <Item.Header>{book.title}</Item.Header>
            <Item.Meta>{book.isbn}</Item.Meta>
            <Item.Meta>Price: {book.price}VND</Item.Meta>
          </Item.Content>
          <button className="buttonAddtoCart" onClick={handleaddToCartProcess}>
            <Icon flipped="horizontally" size="small" name="add to cart" /> ADD
            TO CART
          </button>
        </Item>
      );
    });
  }

  return (
    <Segment loading={isBooksLoading} color="blue">
      <Grid stackable divided>
        <Grid.Row columns="2">
          <Grid.Column width="3">
            <Header as="h2">
              <Icon name="book" />
              <Header.Content>Books</Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Form onSubmit={handleSearchBook}>
              <Input
                action={{ icon: "search" }}
                name="bookTextSearch"
                placeholder="Search by ISBN or Title"
                value={bookTextSearch}
                onChange={handleInputChange}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Item.Group divided unstackable relaxed link>
        {bookList}
      </Item.Group>
    </Segment>
  );
}

export default BookList;
