import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

describe("AuthContext", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("provides initial auth state", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("calls login and updates state", async () => {
    localStorage.setItem("access_token", "test-token");
    localStorage.setItem("refresh_token", "test-refresh");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          id: 1, 
          username: "testuser",
          email: "test@example.com"
        }),
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login({ username: "testuser" });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it("logs out user and clears tokens", async () => {
    localStorage.setItem("access_token", "test-token");
    localStorage.setItem("refresh_token", "refresh-token");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
    }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("calls register function", async () => {
    localStorage.setItem("access_token", "test-token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          id: 1, 
          username: "newuser",
          email: "new@example.com"
        }),
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.register({
        username: "newuser",
        email: "new@example.com",
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it("handles authentication errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it("loads user from token on mount if token exists", async () => {
    localStorage.setItem("access_token", "existing-token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          id: 1, 
          username: "existinguser",
          email: "existing@example.com"
        }),
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(
        expect.objectContaining({
          username: "existinguser",
        }),
      );
    });
  });
});
