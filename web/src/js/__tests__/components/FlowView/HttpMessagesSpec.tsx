import * as React from "react";
import { Request } from "../../../components/FlowView/HttpMessages";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

const mockCopyToClipboard = jest.fn();

jest.mock("../../../utils", () => ({
    ...jest.requireActual("../../../utils"),
    copyToClipboard: (textPromise: Promise<string>) =>
        mockCopyToClipboard(textPromise),
}));

describe("HTTP message copy buttons", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        mockCopyToClipboard.mockReset();
    });

    test("copies request headers", async () => {
        fetchMock.mockResponse(
            JSON.stringify({
                text: "body",
                view_name: "Raw",
                description: "",
                syntax_highlight: "none",
            }),
        );

        render(<Request />);

        await waitFor(() => screen.getByText("body"));

        fireEvent.click(screen.getByTitle("Copy headers"));

        expect(await mockCopyToClipboard.mock.calls[0][0]).toBe(
            "header: qvalue\ncontent-length: 7",
        );
    });
});
