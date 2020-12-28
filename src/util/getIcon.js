import { Folder, Image, InsertDriveFile } from '@material-ui/icons';

export const getIcon = (file) => {
    if (file.kind === "prefix") {
        return <Folder style={{ fontSize: 70, marginBottom: 10, color: "gray" }} />
    }

    if (file.name.includes(".docx")) {
        return (
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ position: "absolute", color: "white", marginTop: 12 }}>.docx</div>
                <InsertDriveFile style={{ fontSize: 70, marginBottom: 10 }} color="primary" />
            </div>
        )
    }

    if (file.name.includes(".jpg") || file.name.includes(".jpeg") || file.name.includes(".png")) {
        return <Image style={{ fontSize: 70, marginBottom: 10, color: "#4bbc4b" }} />
    }

    if (file.name.includes(".txt")) {
        return (
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ position: "absolute", color: "white", marginTop: 12 }}>.txt</div>
                <InsertDriveFile style={{ fontSize: 70, marginBottom: 10, color: "gray" }} />
            </div>
        )
    }

    if (file.name.includes(".pdf")) {
        return (
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ position: "absolute", color: "white", marginTop: 12 }}>.pdf</div>
                <InsertDriveFile style={{ fontSize: 70, marginBottom: 10, color: "#e12828" }} />
            </div>
        )
    }
}