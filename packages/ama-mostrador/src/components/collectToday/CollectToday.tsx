import "./CollectToday.scss"

interface CollectTodayProps {
    className?: string
}

function CollectToday({ className = "" }: CollectTodayProps) {

    // Computed in the browser, so the date is the viewer's local day
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`

    return (
        <p className={`text-trans--uppercase ${className}`.trim()}>Collect today [{formattedDate}], own forever</p>
    )
}

export default CollectToday
