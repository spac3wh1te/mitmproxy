import * as React from "react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import HideHostsModal from "../../../components/Modal/HideHostsModal";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import { TStore, testState } from "../../ducks/tutils";

enableFetchMocks();

describe("HideHostsModal", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("saves hide host patterns and persists options", async () => {
        fetchMock.mockResponses("", "");
        const store = TStore({
            ...testState,
            options: {
                ...testState.options,
                web_hide_hosts: ["*.aa.bb.com"],
            },
        });

        render(<HideHostsModal />, { store });

        expect(screen.getByDisplayValue("*.aa.bb.com")).toBeTruthy();

        fireEvent.change(screen.getByLabelText("Host patterns"), {
            target: {
                value: "*.aa.bb.com\noss.abc.*\n\n",
            },
        });
        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(fetchMock.mock.calls[0][0]).toBe("./options");
        expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({
            web_hide_hosts: ["*.aa.bb.com", "oss.abc.*"],
        });
        expect(fetchMock.mock.calls[1][0]).toBe("./options/save");
        expect(fetchMock.mock.calls[1][1]!.method).toBe("POST");
    });
});
