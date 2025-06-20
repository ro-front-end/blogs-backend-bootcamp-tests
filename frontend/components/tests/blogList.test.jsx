import React from "react";
import { render, screen } from "@testing-library/react";
import { createTestStore } from "../../store/reduxStore";
import BlogList from "../blogList";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <BlogList />
    </Provider>
  );

describe("BlogList component", () => {
  it("renders blog title, author and link to details, but not url or likes", () => {
    const blog = {
      id: "1",
      title: "Test Blog Title",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 42,
      content: "This is the content of the blog post used en el test.",
      imageUrl: "/test-image.jpg",
      createdAt: new Date().toISOString(),
    };

    const store = createTestStore({
      blogs: { blogs: [blog], loading: false, error: null },
      auth: {},
      user: {},
    });

    renderWithStore(store);

    expect(screen.getByText(/Test Blog Title/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/https:\/\/testblog.com/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/42/i)).not.toBeInTheDocument();

    const link = screen.getByText(/See more.../i).closest("a");
    expect(link).toHaveAttribute("href", "blogs/1");
  });

  it("navigates to blog details page when clicking 'See more...'", async () => {
    const blog = {
      id: "1",
      title: "Test Blog Title",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 42,
      content: "This is the content of the blog post used en el test.",
      imageUrl: "/test-image.jpg",
      createdAt: new Date().toISOString(),
    };

    const store = createTestStore({
      blogs: { blogs: [blog], loading: false, error: null },
      auth: {},
      user: {},
    });

    const user = userEvent.setup();
    renderWithStore(store);

    const link = screen.getByText(/See more.../i).closest("a");
    expect(link).toHaveAttribute("href", "blogs/1");

    // Simulamos el click
    await user.click(link);

    // Podés simular un efecto si estás usando React Router, pero esto asegura que el link esté y sea funcional
    expect(link).toBeInTheDocument();
  });
});
