import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import AuthContext from "../context/AuthContext";
import { bookApi } from "../misc/BookApi";
import AdminTab from "./AdminTab";
import { handleLogError } from "../misc/Helpers";

class AdminPage extends Component {
  static contextType = AuthContext;

  state = {
    users: [],
    books: [],
    bookIsbn: "",
    bookTitle: "",
    price: 0,
    bookTextSearch: "",
    userUsernameSearch: "",
    isAdmin: true,
    isUsersLoading: false,
    isBooksLoading: false,
  };

  componentDidMount() {
    const Auth = this.context; // this.context = useAuth()
    const user = Auth.getUser();
    const isAdmin = user.role === "ADMIN";
    this.setState({ isAdmin });

    this.handleGetUsers();
    this.handleGetBooks();
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleClear = () => {
    this.setState({ bookIsbn: "", bookTitle: "", price: 0 });
  };
  handleGetUsers = () => {
    const Auth = this.context;
    const user = Auth.getUser();

    this.setState({ isUsersLoading: true });
    bookApi
      .getUsers(user)
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        handleLogError(error);
      })
      .finally(() => {
        this.setState({ isUsersLoading: false });
      });
  };

  handleDeleteUser = (username) => {
    const Auth = this.context;
    const user = Auth.getUser();

    bookApi
      .deleteUser(user, username)
      .then(() => {
        this.handleGetUsers();
      })
      .catch((error) => {
        handleLogError(error);
      });
  };

  handleSearchUser = () => {
    const Auth = this.context;
    const user = Auth.getUser();

    const username = this.state.userUsernameSearch;
    bookApi
      .getUsers(user, username)
      .then((response) => {
        const data = response.data;
        const users = data instanceof Array ? data : [data];
        this.setState({ users });
      })
      .catch((error) => {
        handleLogError(error);
        this.setState({ users: [] });
      });
  };

  handleSetDataUpForm = (data) => {
    this.setState({
      bookIsbn: data.isbn,
      bookTitle: data.title,
      price: data.price,
    });
  };

  handleGetBooks = () => {
    const Auth = this.context;
    const user = Auth.getUser();

    this.setState({ isBooksLoading: true });
    bookApi
      .getBooks(user)
      .then((response) => {
        this.setState({ books: response.data });
      })
      .catch((error) => {
        handleLogError(error);
      })
      .finally(() => {
        this.setState({ isBooksLoading: false });
      });
  };

  handleDeleteBook = (isbn) => {
    const Auth = this.context;
    const user = Auth.getUser();

    bookApi
      .deleteBook(user, isbn)
      .then(() => {
        this.handleGetBooks();
      })
      .catch((error) => {
        handleLogError(error);
      });
  };

  handleAddBook = () => {
    const Auth = this.context;
    const user = Auth.getUser();

    let { bookIsbn, bookTitle, price } = this.state;
    bookIsbn = bookIsbn.trim();
    bookTitle = bookTitle.trim();
    if (!(bookIsbn && bookTitle)) {
      return;
    }

    const book = {
      isbn: bookIsbn,
      title: bookTitle,
      price: price,
      id: bookIsbn,
    };

    bookApi
      .addBook(user, book)
      .then((response) => {
        alert("complete");
        this.clearBookForm();
        this.handleGetBooks();
      })
      .catch((error) => {
        handleLogError(error);
      });
  };

  handleSearchBook = () => {
    const Auth = this.context;
    const user = Auth.getUser();

    const text = this.state.bookTextSearch;
    console.log(text);
    bookApi
      .getBooks(user, text)
      .then((response) => {
        const books = response.data;
        this.setState({ books });
      })
      .catch((error) => {
        handleLogError(error);
        this.setState({ books: [] });
      });
  };

  clearBookForm = () => {
    this.setState({
      bookIsbn: "",
      bookTitle: "",
      price: 0,
    });
  };

  render() {
    if (!this.state.isAdmin) {
      return <Redirect to="/" />;
    } else {
      const {
        isUsersLoading,
        users,
        userUsernameSearch,
        isBooksLoading,
        books,
        bookIsbn,
        bookTitle,
        bookTextSearch,
        price,
      } = this.state;
      return (
        <Container>
          <AdminTab //gọi component AdminTab -->chạy vào Constructor và render
            handleSetDataUpForm={this.handleSetDataUpForm}
            isUsersLoading={isUsersLoading}
            users={users}
            handleClear={this.handleClear}
            price={price}
            userUsernameSearch={userUsernameSearch}
            handleDeleteUser={this.handleDeleteUser}
            handleSearchUser={this.handleSearchUser}
            isBooksLoading={isBooksLoading}
            books={books}
            bookIsbn={bookIsbn}
            bookTitle={bookTitle}
            bookTextSearch={bookTextSearch}
            handleAddBook={this.handleAddBook}
            handleDeleteBook={this.handleDeleteBook}
            handleSearchBook={this.handleSearchBook}
            handleInputChange={this.handleInputChange}
          />
        </Container>
      );
    }
  }
}

export default AdminPage;
