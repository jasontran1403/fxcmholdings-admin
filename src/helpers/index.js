export function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

export const toast = (type, message) => {
    (function () {
        const Toast = window.Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        Toast.fire({
            icon: type,
            title: message
        }).then(() => {
            if (
                message === "Swap successful" ||
                message === "Transfer successful" ||
                message === "Deposit successful" ||
                message === "Withdraw successful" ||
                message === "Buy package successful" ||
                message === "Withdraw capital successful" ||
                message === "Enable 2FA success" ||
                message === "Disabled 2FA success" ||
                message === "Change password success" ||
                message === "Get point successful" ||
                message === "Huỷ lệnh nạp thành công!"
            ) {
                setTimeout(() => {
                    window.location.reload();
                }, 0);
            }
        });
    })();
};

export const confirmAlert = executeFunction => {
    window.Swal.fire({
        title: "Are you sure?",
        text: "You wont be able to revert this transaction!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then(result => {
        if (result.isConfirmed) {
            executeFunction();
            window.Swal.fire("Confirmed!", "Your transaction has been created.", "success");
        }
    });
};

export const checkPermissions = (permissions = []) => {
    let found = false;
    const userPermissions = ["add", "update", "delete"];
    if (userPermissions) {
        permissions.forEach(item => {
            found = found || userPermissions.includes(item);
        });
    }
    return found;
};

export const scrollTop = () => {
    const element = document.getElementById("top-page");
    if (element) {
        const position = getOffset(element);
        window.scrollTo(position.left, 0);
    }
};

export const formatToCurrency = value => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(
        parseFloat(value)
    );
};

export const formatToCurrencyVND = value => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        parseFloat(value)
    );
};