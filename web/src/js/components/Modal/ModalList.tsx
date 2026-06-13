import * as React from "react";
import ModalLayout from "./ModalLayout";
import HideHostsContent from "./HideHostsModal";
import OptionContent from "./OptionModal";

function OptionModal() {
    return (
        <ModalLayout>
            <OptionContent />
        </ModalLayout>
    );
}

function HideHostsModal() {
    return (
        <ModalLayout>
            <HideHostsContent />
        </ModalLayout>
    );
}

export default {
    HideHostsModal,
    OptionModal,
};
