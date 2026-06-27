import asyncio
import asyncpg

async def main():
    try:
        conn = await asyncpg.connect(
            "postgresql://swarmnet:swarmnet_secret@127.0.0.1:5432/swarmnet_db"
        )

        print("CONNECTED SUCCESSFULLY")
        await conn.close()

    except Exception as e:
        print("ERROR:", repr(e))

asyncio.run(main())