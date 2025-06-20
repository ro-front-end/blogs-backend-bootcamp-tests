import React from "react";

import { createTestStore } from "@/store/reduxStore";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import CreateBlogForm from "../createBlogForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
}));

const mockUser = {
  username: "testUser",
};

const mockAuthState = {
  user: mockUser,
  token: "mock-token",
  loading: false,
  error: null,
};

const mockBlogsState = {
  blogs: [],
  loading: false,
  error: null,
};

const mockStore = createTestStore({
  auth: mockAuthState,
  blogs: mockBlogsState,
  user: {},
});

describe("CreateBlogForm", () => {
  it("calls onSubmitCallback with vorrect formData", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Provider store={mockStore}>
        <CreateBlogForm
          onSubmitCallBack={mockSubmit}
          isEdit={true}
          showForm={true}
          handleCloseForm={() => {}}
        />
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/title/i);
    const contentInput = screen.getByPlaceholderText(/content/i);
    const submitButton = screen.getByRole("button", { name: /edit post/i });

    await user.type(titleInput, "Test Blog Title");
    await user.type(contentInput, "This is the blog content");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    const formDataArg = mockSubmit.mock.calls[0][0];
    expect(formDataArg instanceof FormData).toBe(true);
    expect(formDataArg.get("title")).toBe("Test Blog Title");
    expect(formDataArg.get("author")).toBe("testUser");
    expect(formDataArg.get("content")).toBe("This is the blog content");
  });
});
