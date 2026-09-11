import { useState } from "react";
import styles from "../../css/postSearch.module.css";
import type { Post } from "../../shared/types/types";
import { conditionCategory, genders } from "../../shared/constants/constants";

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
        const keyWords = searchText.normalize("NFKC").trim().split(/\s+/)

        const filteredPosts = posts.filter((post)=>{
            const gender = post.careRecipientGender !== undefined && post.careRecipientGender !== null ? genders[post.careRecipientGender]:""

            const conditions = post.conditionCategory?.map((condition)=>{
                return conditionCategory[condition]}).join(",")??""
            
            const age = post.careRecipientAge ? Number(post.careRecipientAge.normalize("NFKC")) : null
            
            const ageGroup = age !== null ?  `${Math.floor(age/10)*10}代` : ""
            const ageText = age !== null ? `${age}歳` : ""

            return keyWords.every((keyWord)=>{
                return post.text.normalize("NFKC").includes(keyWord)
                || post.name.normalize("NFKC").includes(keyWord)
                ||post.careRecipientAge?.normalize("NFKC").includes(keyWord)
                ||ageGroup.includes(keyWord)
                ||ageText.includes(keyWord)
                ||gender.includes(keyWord)
                ||conditions.includes(keyWord)
            })
            
        })
        setSearchedPosts(filteredPosts)
    }
    return (
        <div className={styles.container}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
            <input type="text" placeholder="例：介護 60代 女性 認知症" value={searchText} onChange={handleChange} className={styles.searchInput}/>
            <button className={styles.searchButton} disabled={searchText.trim()===""}>検索</button>
            </form>
        </div>
    )
}