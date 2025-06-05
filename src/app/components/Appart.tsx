import styles from "@/app/css/Appart.module.css"

export default function Appart()
{
    return (
        <div className={styles.appart}>
            <div className={styles.title}>
                <img src="appart.png" alt="Appart" />
                Top 10 appartements
            </div>
            <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(193, 50, 43)' }}>
                    <img src="rooms.png" alt="" />
                    20
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(193, 50, 43)' }}>
                    <img src="rooms.png" alt="" />
                    20
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(193, 50, 43)' }}>
                    <img src="rooms.png" alt="" />
                    20
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(193, 50, 43)' }}>
                    <img src="rooms.png" alt="" />
                    16
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(255, 176, 26)' }}>
                    <img src="rooms.png" alt="" />
                    6
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(255, 176, 26)' }}>
                    <img src="rooms.png" alt="" />
                    6
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: 'rgb(255, 176, 26)' }}>
                    <img src="rooms.png" alt="" />
                    6
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: '#62b061' }}>
                    <img src="rooms.png" alt="" />
                    2
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: '#62b061' }}>
                    <img src="rooms.png" alt="" />
                    2
                </div>
               Reception de ViceHabbo
            </div>
             <div className={styles.appartItem}>
               <div className={styles.count} style={{ backgroundColor: '#62b061' }}>
                    <img src="rooms.png" alt="" />
                    2
                </div>
               Reception de ViceHabbo
            </div>
        </div>
    );
}