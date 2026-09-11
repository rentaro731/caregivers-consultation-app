import { useState } from "react";
import styles from "../../css/postSearch.module.css";
import type { Post } from "../../shared/types/types";

export const PostSearch = ({posts,setSearchedPosts,setIsSearched}:
    {posts:Post[],
    setSearchedPosts:React.Dispatch<React.SetStateAction<Post[]>>,
    setIsSearched:React.Dispatch<React.SetStateAction<boolean>>}) => {

    const [searchText,setSearchText] = useState("");

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setSearchText(value);
    }

    const handleSearch = (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSearched(true)
        const keyWords = searchText.trim().split(/\s+/)
        const filteredPosts = posts.filter((post)=>{
            return keyWords.every((keyWord)=>{
                return post.text.includes(keyWord)|| post.name.includes(keyWord)
            })
        })
        setSearchedPosts(filteredPosts)
    }
    return (
        <div className={styles.container}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
            <input type="text" placeholder="投稿を検索"  value={searchText} onChange={handleChange} className={styles.searchInput}/>
            <button className={styles.searchButton} disabled={searchText.trim()===""}>検索</button>
            </form>
        </div>
    )
}