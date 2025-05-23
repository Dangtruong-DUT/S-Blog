/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactQuill, { Quill } from 'react-quill'
import BlotFormatter from 'quill-blot-formatter'
import ImageResize from 'quill-image-resize-module-react'
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import './EditorQuill.scss'
import { Delta, DeltaStatic, Sources, StringMap } from 'quill'
import uploadApi from 'src/apis/upload.api'
import { HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'

Quill.register('modules/blotFormatter', BlotFormatter)
Quill.register('modules/imageResize', ImageResize)

const quillImageCallback = function (this: any) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()

    input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await uploadApi.uploadImage(formData)
            console.log('response', response.data)
            if (response.status !== HttpStatusCode.Created) {
                toast.error(response.data.message)
                return
            }

            const quill = this.quill
            const range = quill.getSelection()
            console.log('image', response.data.data.url)
            if (range) quill.insertEmbed(range.index, 'image', response.data.data.url)
        } catch (error) {
            console.error('Error uploading image:', error)
        }
    }
}

const modules: StringMap = {
    toolbar: {
        container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        handlers: {
            image: quillImageCallback
        }
    },
    clipboard: {
        matchVisual: false
    },
    blotFormatter: {},
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
    }
}

interface EditorQuillProps {
    value?: string
    onChange: (value: string) => void
}

const EditorQuill: ForwardRefRenderFunction<ReactQuill, EditorQuillProps> = ({ value, onChange }, ref) => {
    const quillRef = useRef<ReactQuill>(null)

    useImperativeHandle(ref, () => quillRef.current as ReactQuill)
    const [localDelta, setLocalDelta] = useState<Delta | undefined>(undefined)

    const parsedDelta = useMemo(() => {
        if (value) {
            try {
                return JSON.parse(value) as Delta
            } catch (error) {
                console.error('Lỗi khi parse JSON Delta:', error)
                return undefined
            }
        }
        return undefined
    }, [value])

    const handleChange = (
        value: string,
        delta: DeltaStatic,
        source: Sources,
        editor: ReactQuill.UnprivilegedEditor
    ) => {
        onChange(JSON.stringify(editor.getContents()))
        setLocalDelta(editor.getContents())
    }

    useEffect(() => {
        setLocalDelta(parsedDelta)
    }, [parsedDelta])

    return (
        <ReactQuill
            ref={quillRef}
            theme='snow'
            modules={modules}
            style={{ marginBottom: '16px' }}
            placeholder='content ...'
            onChange={handleChange}
            value={localDelta}
        />
    )
}

export default forwardRef(EditorQuill)
