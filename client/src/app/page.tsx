import { HoverBorderGradientDemo } from "@/components/Button"

export default function Page() {
  return (
    <><div className="flex justify-center-safe">
        <h1>HomePage</h1>
        <HoverBorderGradientDemo text="Make A Complaint" href="/complaint"/>
        <HoverBorderGradientDemo text="Admin View" href="/admin"/>
    </div>

    </>
  )
}