import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import { getIdFromNameId } from 'src/utils/common.util'
import createSocialLink from 'src/utils/socialLink'
import { convertToHtml } from 'src/utils/convertQuillToHTML'
import hljs from 'highlight.js'
import { DeltaStatic } from 'quill'

export function useBlogDetail() {
    const { nameId } = useParams()
    const id = getIdFromNameId(nameId as string)

    const { data, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogApi.getBlogDetail(id as string)
    })

    const blog = data?.data.data

    const socialLinks = useMemo(() => {
        return blog ? createSocialLink({ title: blog.title, url: nameId as string }) : null
    }, [blog, nameId])

    const contentHtml = useMemo(() => {
        if (!blog?.content) return ''
        hljs.highlightAll()
        try {
            const delta = JSON.parse(blog.content) as DeltaStatic
            return convertToHtml(delta)
        } catch {
            return `<p style="color: #d32f2f; font-weight: bold;">
                *An error occurred while displaying the content. We sincerely apologize.
            </p>`
        }
    }, [blog?.content])

    return { blog, isLoading, contentHtml, socialLinks, id }
}
