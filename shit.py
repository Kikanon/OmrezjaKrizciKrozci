for x in range(0,9):
    print("""            <div class="element" onclick="move({})" >
                <img id="{}" src="images/empty_block.png" height="100px">
            </div>
            """.format(x,x))