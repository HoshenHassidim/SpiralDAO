"use client"
import { useRouter } from 'next/navigation'

export default function ProblemPage({ params }: { params: { slug: string } }) {
    const router = useRouter()
    // const {id} = router.query

    return (<div>
        {params.slug}
        
    </div>)
}