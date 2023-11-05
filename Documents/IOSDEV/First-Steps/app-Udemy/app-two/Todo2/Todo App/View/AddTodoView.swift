//
//  AddTodoView.swift
//  Todo App
//
//  Created by Roberta Marino on 04/11/23.
//

import SwiftUI

struct AddTodoView: View {
    //MARK: PROPERTIES
    
    @Environment(\.managedObjectContext) var managedObjectContext
    @Environment(\.presentationMode) var presentationMode
    
    @State private var namex: String = ""
    @State private var priority: String = "Normal"
    let priorities = ["high", "Normal", "Low"]
    
    
    //MARK: BODY
    var body: some View {
        NavigationView{
            VStack{
                Form{
                    //MARK: TODO NAME
                    TextField("Todo", text: $namex)
                    
                    //MARK: TODO PRIORITY
                    
                    Picker("Priotity", selection: $priority){
                        ForEach(priorities, id: \.self){
                            Text($0)
                        }
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    
                    //MARK: -SAVE BUTTON
                    Button(action:{
                        if self.namex != "" {
                            print("Save a new todo item.")
                            let todo = Todo(context: self.managedObjectContext)
                            todo.namex = self.namex
                            todo.priority = self.priority
                            
                            do{
                                try self.managedObjectContext.save()
                                print("New todo: \(todo.namex ?? ""), Priority: \(todo.priority ?? "")")
                                self.presentationMode.wrappedValue.dismiss()
                            }catch{
                                print(error)
                            }
                        }
                    }){
                            Text("Save")
                        }//:SAVEBUTTON
                    }//:FORM
                Spacer()
            }//:VStack
            .navigationBarTitle("New Todo", displayMode: .inline)
            .navigationBarItems(trailing: Button(action: {self.presentationMode.wrappedValue.dismiss()}){
                Image(systemName: "xmark")
                }
            )
        }//: Navigation
    }
}

//MARK: PREVIEW
struct AddTodoView_Previews: PreviewProvider {
    static var previews: some View {
        AddTodoView()
    }
}
