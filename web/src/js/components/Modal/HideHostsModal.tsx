import * as React from "react";
import * as modalAction from "../../ducks/ui/modal";
import { fetchApi } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../ducks";
import Icon from "../common/Icon";
import Button from "../common/Button";

export default function HideHostsModal() {
    const dispatch = useAppDispatch();
    const webHideHosts = useAppSelector((state) => state.options.web_hide_hosts);
    const [value, setValue] = React.useState(webHideHosts.join("\n"));
    const [error, setError] = React.useState<string>();
    const [isSaving, setIsSaving] = React.useState(false);

    const save = async () => {
        const hosts = value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        setIsSaving(true);
        setError(undefined);
        try {
            const updateResponse = await fetchApi.put("/options", {
                web_hide_hosts: hosts,
            });
            if (!updateResponse.ok) {
                throw new Error(await updateResponse.text());
            }

            const saveResponse = await fetchApi("/options/save", {
                method: "POST",
            });
            if (!saveResponse.ok) {
                throw new Error(await saveResponse.text());
            }

            dispatch(modalAction.hideModal());
        } catch (e) {
            setError(e.toString());
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="modal-header">
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={() => dispatch(modalAction.hideModal())}
                >
                    <Icon name="close" />
                </button>
                <div className="modal-title">
                    <h4>Hide Hosts</h4>
                </div>
            </div>

            <div className="modal-body">
                <div className="form-horizontal">
                    <div className="form-row">
                        <div className="col-6">
                            <label
                                className="control-label"
                                htmlFor="web-hide-hosts"
                            >
                                Host patterns
                            </label>
                        </div>
                        <div className="col-6">
                            <textarea
                                id="web-hide-hosts"
                                className="input"
                                rows={8}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            {error && (
                                <div className="text-small text-danger">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <Button
                    onClick={save}
                    icon="confirm"
                    iconClassName="text-success"
                    disabled={isSaving}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
